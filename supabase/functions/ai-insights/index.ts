import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Entry {
  food: string;
  symptoms: string[];
  severity: number;
  notes?: string;
  timestamp: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, child, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!Array.isArray(entries) || entries.length === 0) {
      return new Response(
        JSON.stringify({ error: "no_entries" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const langName = language === "ar" ? "Arabic" : language === "fr" ? "French" : "English";

    const compactEntries = (entries as Entry[]).slice(0, 50).map((e) => ({
      food: e.food,
      symptoms: e.symptoms,
      severity: e.severity,
      date: new Date(e.timestamp).toISOString().slice(0, 10),
      notes: e.notes?.slice(0, 120),
    }));

    const systemPrompt = `You are a pediatric allergy assistant. You analyze a child's food and symptom logs to detect potential allergens, patterns and risks. You are NOT a doctor — always advise consulting a pediatrician for diagnosis. Respond in ${langName}. Be warm, concise and reassuring.`;

    const userPrompt = `Child profile: ${JSON.stringify(child ?? {})}.\nLogs (most recent first):\n${JSON.stringify(compactEntries)}\n\nAnalyze correlations between foods and symptoms. Identify the most suspicious food, the risk level, whether there is a recurring pattern, your confidence (0-100), a short reasoning summary, and 3 short actionable tips for the parent.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_insights",
                description: "Return structured allergy insights",
                parameters: {
                  type: "object",
                  properties: {
                    topFood: { type: "string", description: "Most suspicious food" },
                    risk: { type: "string", enum: ["low", "med", "high"] },
                    pattern: { type: "boolean" },
                    confidence: { type: "number", description: "0 to 100" },
                    summary: { type: "string", description: "1-2 sentence reasoning in target language" },
                    tips: {
                      type: "array",
                      items: { type: "string" },
                      description: "3 short actionable tips for the parent in target language",
                    },
                  },
                  required: ["topFood", "risk", "pattern", "confidence", "summary", "tips"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "report_insights" } },
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limit" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "payment_required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "no_tool_call" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insights error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
