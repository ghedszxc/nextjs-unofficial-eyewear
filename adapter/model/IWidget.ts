import { GenericWidgetNameModel, GenericWidgetValueModel } from "./IGenericWidgetValue";

export interface IWidgetModel {
  widgetName: GenericWidgetNameModel;
  widgetValue: GenericWidgetValueModel;
  lang: Language;
}
