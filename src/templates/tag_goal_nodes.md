Scenario:
"{{scenario_text}}"

Start node id: "{{start_node_id}}"

Graph nodes (choose targets ONLY from these):
[
{{#nodes}}
{
"id": "{{id}}",
"name": "{{name}}",
"widgets": [
{{#widgets}}
"{{.}}"{{^last}},{{/last}}
{{/widgets}}
]
}{{^last}},{{/last}}
{{/nodes}}
]

Return JSON with this exact schema:
{
"scenario_id": "{{scenario_id}}",
"targets": [
{ "node_id": "string", "confidence": 0.0, "evidence": "short keywords" }
],
"required_milestones": ["node_id"],
"notes": "one short sentence"
}
Rules:

"required_milestones" are intermediate nodes that must appear in the path to make the scenario valid (e.g., login page before logged-in page). Only use IDs from the node list.

confidence is 0.0–1.0 (float).

Do NOT invent node IDs.

Keep evidence short (max 12 words).
