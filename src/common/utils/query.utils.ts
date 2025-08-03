export function buildQueryParams(query: any) {
  const filter: any = {};

  // ====== FILTER ======
  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }

  if (query.skills) {
    filter.skills = { $regex: query.skills, $options: 'i' };
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: 'i' };
  }

  if (query.email) {
    filter.email = { $regex: query.email, $options: 'i' };
  }

  if (query.level) {
    const levels = query.level.split(',').map((l: string) => ({
      level: { $regex: l, $options: 'i' }
    }));
    filter.$or = levels;
  }

  if (query.address) {
    filter.address = { $regex: query.address, $options: 'i' };
  }

  if (query.age) {
    filter.age = query.age;
  }

  if (query.salary) {
    filter.salary = query.salary;
  }

  if (query.gender) {
    filter.gender = { $regex: query.gender, $options: 'i' };
  }

  if (query.company) {
    filter.company = { name: { $regex: query.company.name, $options: 'i' } };
  }

  if (query.role) {
    filter.role = { $regex: query.role, $options: 'i' };
  }

  // ====== SORT ======
  const sort: any = {};
  if (query.sortBy) {
    const fields = query.sortBy.split(',');
    const orders = query.order?.split(',') || [];

    fields.forEach((field: string, index: number) => {
      sort[field] = orders[index] === 'desc' ? -1 : 1;
    });
  }

  // ====== POPULATE ======
  const populates = query.populate
    ? query.populate.split(',').map((p: string) => p.trim())
    : [];


  // ====== FIELDS ======
  const fieldsSelect = query.fields
    ? query.fields.split(',').join(' ')
    : '';

  return { filter, sort, populates, fieldsSelect };
}
