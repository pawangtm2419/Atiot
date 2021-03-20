import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isActivePipe',
  // pure: false
})
@Injectable()
export class IsActivePipe implements PipeTransform {
  transform(items: any[], param: boolean): any {
    if (items) {
      return items.filter((item, index) => item.isActive == param);
    }
  }
}

