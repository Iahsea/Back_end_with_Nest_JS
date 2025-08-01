export function buildFilter(query: any) {
  const filter: any = {};

  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }

  if (query.skills) {
    filter.skills = { $regex: query.skills, $options: 'i' };
  }

  if (query.email) {
    filter.email = { $regex: query.email, $options: 'i' };
  }

  if (query.level) {
    filter.level = { $regex: query.level, $options: 'i' };
  }

  if (query.address) {
    filter.address = { $regex: query.address, $options: 'i' };
  }

  if (query.age) {
    filter.age = query.age; // nếu age là số thì không cần regex
  }

  if (query.salary) {
    filter.salary = query.salary; // nếu age là số thì không cần regex
  }

  if (query.gender) {
    filter.gender = { $regex: query.gender, $options: 'i' };
  }

  if (query.company) {
    filter.company.name = { $regex: query.company.name, $options: 'i' };
  }

  if (query.role) {
    filter.role = { $regex: query.role, $options: 'i' };
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

