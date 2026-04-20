export type Product = {
  nome: string
  valor: number
  deliveryUrl: string
}

export const PRODUCTS: Record<string, Product> = {
  'basic': {
    nome: 'Recheios Secretos Básico',
    valor: 1.99,
    deliveryUrl: 'https://acesso-receitas-recheioss-basic1.lovable.app/',
  },
  'premium': {
    nome: 'Recheios Secretos Premium',
    valor: 7.99,
    deliveryUrl: 'https://acesso-receitas-recheioss-basic1.lovable.app/',
  },
  'pudim-basic': {
    nome: 'Pudim Sem Fogo — Básico',
    valor: 3.49,
    deliveryUrl: 'https://drive.google.com/file/d/1QTngFs-YiKdQqgalqtxXjBgREC0itQBf/view?usp=sharing',
  },
  'pudim-premium': {
    nome: 'Pudim Sem Fogo — Premium',
    valor: 9.90,
    deliveryUrl: '', // preencher com link do Drive quando o PDF premium estiver pronto
  },
  'sobremesas-bump': {
    nome: 'Sobremesas Sem Fogo — Coleção Completa',
    valor: 4.90,
    deliveryUrl: '', // preencher quando tiver o PDF
  },
}
