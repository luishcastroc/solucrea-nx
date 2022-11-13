import { Pipe, PipeTransform } from '@angular/core';
import { Prisma } from '@prisma/client';

@Pipe({
  name: 'decimalToNumber',
  standalone: true,
})
export class DecimalToNumberPipe implements PipeTransform {
  transform(
    value: Prisma.Decimal | number | string | undefined,
    ...args: unknown[]
  ): number {
    if (value) {
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'string') {
        return Number(value);
      } else {
        return value.toNumber();
      }
    } else {
      return 0;
    }
  }
}
