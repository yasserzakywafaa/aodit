import { useEffect } from "react";

/**
 * Hook to inject Schema.org JSON-LD structured data into the page
 * @param schema - The Schema.org JSON-LD object
 * @param id - Optional unique ID for the script tag (useful for updates)
 */
export const useSchemaOrg = (
  schema: object | null,
  id: string = "schema-org"
) => {
  useEffect(() => {
    if (!schema) {
      // Remove existing schema if schema is null
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    // Remove existing schema with same ID if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script tag with JSON-LD
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, id]);
};
