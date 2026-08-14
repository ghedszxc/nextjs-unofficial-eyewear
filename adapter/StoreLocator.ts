import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ILocatorConfig } from '../models/widgets/IStoreLocator';
import { api } from "@/lib/api";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export class StoreLocatorAdapter extends Adapter<ILocatorConfig, Promise<Nullable<ILocatorConfig>>> {
  adapt = async (source: any): Promise<Nullable<ILocatorConfig>> => {
    const data = source?.contents?.[0];

    return {
      selector: "", 
      locale: "", 
      tenantKey: ""
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
