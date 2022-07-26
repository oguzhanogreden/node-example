type EnergyType = 'solar' | 'wind'

const transformers = {
  from: (dbType: string) => DbToJsMap.get(dbType),
  to: (jsType: EnergyType) => JsToDbMap.get(jsType),
}

// Ideally: Stored data should be properly normalised.
//          In a relational setting, business relevant entities should be stored
//          in lower-dimensional tables (e.g. "star schema").
const DbToJsMap = new Map<string, EnergyType>([
  ['Solar', 'solar'],
  ['Wind', 'wind']
]);

function reverseMap(m: Map<string, EnergyType>) {
  const reversed = new Map<EnergyType, string>();

  for (var [key, value] of m) {
    reversed.set(value, key);
  }

  return reversed;
}

const JsToDbMap = reverseMap(DbToJsMap);

export {
  EnergyType,
  transformers as energyTypeTransformers
};
