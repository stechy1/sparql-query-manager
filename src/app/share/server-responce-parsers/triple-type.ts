export enum TripleType {
  SELECT, CONSTRUCT
}

export function findTripleType(content: string): TripleType {
  return content.toLowerCase().indexOf('select') !== -1 ? TripleType.SELECT : TripleType.CONSTRUCT;
}
