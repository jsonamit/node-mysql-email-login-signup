exports.pagination = (query, allowedSortFields = []) => {
    const pageNumber = parseInt(query.pageNumber) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const offset = (pageNumber - 1) * pageSize;
  
    const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
    const order = query.order && query.order.toLowerCase() === "asc" ? "ASC" : "DESC";
  
    return { pageNumber, pageSize, offset, sortBy, order };
};
  