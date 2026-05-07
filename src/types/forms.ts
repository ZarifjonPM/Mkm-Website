export interface ContactFormData {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
}

export interface QuoteFormData {
  name: string;
  company: string;
  phone: string;
  email?: string;
  message: string;
  category?: string;
  productName?: string;
}
