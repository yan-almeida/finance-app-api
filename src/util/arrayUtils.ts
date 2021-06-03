interface Grouping<T> {
  key: string;
  elements: T[];
}

export const groupBy = <T = any>(
  collection: T[],
  property: keyof T
): Grouping<T>[] => {
  const grouping: any[] = [];

  collection.forEach(function (obj: any) {
    let isGrouped = false;

    grouping.forEach(function (groupItem) {
      if (groupItem.key == obj[property]) {
        groupItem.elements.push(obj);
        isGrouped = true;
      }
    });

    if (!isGrouped) {
      grouping.push({
        key: obj[property],
        elements: [obj],
        count: [obj].length,
      });
    }
  });

  return grouping;
};
