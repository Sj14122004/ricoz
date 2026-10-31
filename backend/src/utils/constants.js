export const ROLES = { PARENT: 'parent', ADMIN: 'admin' };

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

// Which status can move to which. Anything else is rejected.
export const TRANSITIONS = {
  PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['DISPATCHED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const CATEGORIES = ['formula', 'diapers', 'colic', 'feeding', 'wipes'];
