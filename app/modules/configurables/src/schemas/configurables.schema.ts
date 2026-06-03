/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "gameColors",
      type: "object",
      required: false,
      label: "Game Colors",
      fields: [
        {
          fieldName: "background",
          type: "color",
          required: false,
          label: "Background",
        },
        {
          fieldName: "surface",
          type: "color",
          required: false,
          label: "Surface",
        },
        {
          fieldName: "textPrimary",
          type: "color",
          required: false,
          label: "Text Primary",
        },
        {
          fieldName: "textSecondary",
          type: "color",
          required: false,
          label: "Text Secondary",
        },
        {
          fieldName: "success",
          type: "color",
          required: false,
          label: "Success",
        },
        {
          fieldName: "warning",
          type: "color",
          required: false,
          label: "Warning",
        },
        {
          fieldName: "error",
          type: "color",
          required: false,
          label: "Error",
        },
      ],
    },
    {
      fieldName: "gameSettings",
      type: "object",
      required: false,
      label: "Game Settings",
      fields: [
        {
          fieldName: "levelDurationSeconds",
          type: "number",
          required: false,
          label: "Level Duration (seconds)",
          min: 30,
          max: 300,
        },
        {
          fieldName: "maxCustomers",
          type: "number",
          required: false,
          label: "Max Customers Per Level",
          min: 1,
          max: 20,
        },
        {
          fieldName: "numTables",
          type: "number",
          required: false,
          label: "Number of Tables",
          min: 2,
          max: 8,
        },
        {
          fieldName: "pointsPerDelivery",
          type: "number",
          required: false,
          label: "Points Per Correct Delivery",
          min: 10,
          max: 500,
        },
        {
          fieldName: "enableSoundEffects",
          type: "boolean",
          required: false,
          label: "Enable Sound Effects",
        },
      ],
    },
    {
      fieldName: "menuItems",
      type: "array",
      required: false,
      label: "Menu Items",
      item: {
        type: "object",
        fields: [
          { fieldName: "id", type: "string", required: true, label: "ID" },
          { fieldName: "name", type: "string", required: true, label: "Name" },
          { fieldName: "emoji", type: "string", required: true, label: "Emoji Icon" },
          {
            fieldName: "category",
            type: "enum",
            required: true,
            label: "Category",
            options: ["drink", "food", "dessert"],
          },
          {
            fieldName: "prepTimeSeconds",
            type: "number",
            required: false,
            label: "Prep Time (seconds)",
            min: 1,
            max: 30,
          },
        ],
      },
    },
    {
      fieldName: "welcomeTitle",
      type: "string",
      required: false,
      label: "Welcome Screen Title",
    },
    {
      fieldName: "welcomeSubtitle",
      type: "string",
      required: false,
      label: "Welcome Screen Subtitle",
    },
    {
      fieldName: "playButtonLabel",
      type: "string",
      required: false,
      label: "Play Button Label",
    },
    {
      fieldName: "heroImageUrl",
      type: "url",
      required: false,
      label: "Hero Image URL",
    },
  ],
};
