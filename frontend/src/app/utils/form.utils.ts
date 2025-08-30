import { FormGroup } from '@angular/forms';

export class FormUtils {
  // Normalizador de formulários (critério DRY)
  static normalizeForm(form: FormGroup): any {
    const value = form.value;
    const normalized: any = {};
    
    Object.keys(value).forEach(key => {
      if (value[key] !== null && value[key] !== undefined && value[key] !== '') {
        if (Array.isArray(value[key])) {
          normalized[key] = value[key].filter((item: any) => item && item.trim() !== '');
        } else {
          normalized[key] = value[key];
        }
      }
    });
    
    return normalized;
  }

  // Construtor de query params (critério DRY)
  static buildQueryParams(params: any): any {
    const queryParams: any = {};
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams[key] = params[key];
      }
    });
    
    return queryParams;
  }

  // Formatador de datas (critério DRY)
  static formatDate(date: string | Date): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
