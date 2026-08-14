import WidgetGenerator from "@/components/WidgetGenerator";

type Widget = {
  _uid: string;
  contents: Array<Record<string, any>>;
  component: string;
  layout_variant: Array<Record<string, any>>;
  placement_extra_properties: Array<Record<string, any>>;
  _editable?: string;
};

const StaticPageBuilder: React.FC<{
  lang: Language;
  widgets: Widget[];
}> = ({ widgets, lang }) => {
  return (
    <main>
      {widgets?.map((widget: Widget, key: number) => {
        const widgetName = widget?.layout_variant?.at(0)?.viewtype;
        const widgetId = widget?.component;
        const widgetValue = {
          contents: widget.contents,
          placement_extra_properties: widget.placement_extra_properties,
          component: widget.component,
        };

        return (
          <section key={key} className={widgetName} id={widgetId}>
            <WidgetGenerator widgetName={widgetName} widgetValue={widgetValue} lang={lang} />
          </section>
        );
      })}
    </main>
  );
};

export default StaticPageBuilder;
