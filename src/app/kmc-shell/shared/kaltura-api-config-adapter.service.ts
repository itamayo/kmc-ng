import { Injectable } from '@angular/core';
import { BootstrapAdapter, BootstrapAdapterType, AppConfig } from '@kaltura-ng2/kaltura-core';
import { KalturaApiModule } from '@kaltura-ng2/kaltura-api';
import { KalturaAPIConfig } from '@kaltura-ng2/kaltura-api';
import { AppDefaultConfig } from "./app-default-config.service";



@Injectable()
export class KalturaAPIConfigAdapter implements BootstrapAdapter
{
    type = BootstrapAdapterType.postConfig;
    constructor(private kalturaAPIConfig : KalturaAPIConfig, private appConfig: AppConfig, private AppDefaultConfig: AppDefaultConfig){

    }
    execute() : void {
      // TODO [kmc] handle error scenarios (missing core.kaltura)
      const { apiUrl, apiVersion }  = this.appConfig.get("core.kaltura");
      const kalturaAPIConfig = this.kalturaAPIConfig;
      kalturaAPIConfig.apiUrl = apiUrl;
      kalturaAPIConfig.apiVersion = apiVersion;
    }
}
