import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(arrayOfObject: any[], term: string, fieldName: string): any[] {
    return arrayOfObject.filter(item =>
      item[fieldName]?.toLowerCase().includes(term.toLowerCase())
    );
  }
}
