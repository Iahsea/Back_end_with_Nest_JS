export function buildFilter(query: any) {
  const filter: any = {};

  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }

  if (query.email) {
    filter.email = { $regex: query.email, $options: 'i' };
  }

  if (query.address) {
    filter.address = { $regex: query.address, $options: 'i' };
  }

  return filter;
}



export function buildSort(query: any) {
  const sort: any = {};

  if (query.sortBy) {
    const fields = query.sortBy.split(',');
    const orders = query.order?.split(',') || [];

    fields.forEach((field: string, index: number) => {
      sort[field] = orders[index] === 'desc' ? -1 : 1;
    });
  }

  return sort;
}

