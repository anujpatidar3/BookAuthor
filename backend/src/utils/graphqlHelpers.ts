import { GraphQLResolveInfo } from 'graphql';

/**
 * Check if nested field is requested (e.g., "books.author")
 * @param info - GraphQL resolve info object  
 * @param parentField - Parent field name (e.g., "books")
 * @param nestedField - Nested field name (e.g., "author")
 * @returns boolean indicating if the nested field is requested
 */
export function isNestedFieldRequested(
  info: GraphQLResolveInfo, 
  parentField: string, 
  nestedField: string
): boolean {
  const selections = info.fieldNodes[0]?.selectionSet?.selections || [];
  
  for (const selection of selections) {
    if (selection.kind === 'Field' && selection.name.value === parentField) {
      const nestedSelections = selection.selectionSet?.selections || [];
      return nestedSelections.some(nestedSelection => 
        nestedSelection.kind === 'Field' && nestedSelection.name.value === nestedField
      );
    }
  }
  
  return false;
}
