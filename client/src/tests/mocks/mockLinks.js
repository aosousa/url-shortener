export const getLinksResponse = [
  {
    id: 55,
    title: 'IDASO',
    original_link: 'https://www.idaso.ie/',
    link_code: 'idaso',
    views: 10,
    created_at: '2023-10-05T09:42:02.000Z',
    updated_at: '2023-10-06T10:04:01.000Z'
  },
  {
    id: 56,
    title: 'Formula 2',
    original_link: 'https://www.fiaformula2.com',
    link_code: 'ZICRDrUI',
    views: 5,
    created_at: '2023-10-05T14:14:53.000Z',
    updated_at: '2023-10-05T18:27:53.000Z'
  },
  {
    id: 57,
    title: null,
    original_link: 'https://theverge.com',
    link_code: 'BxTytmhx',
    views: 0,
    created_at: '2023-10-06T10:03:08.000Z',
    updated_at: null
  }
]

export const createLinkRequest = {
  title: 'GAA Fixtures',
  original_link: 'https://www.gaa.ie/fixtures-results/',
  link_code: 'gaa'
}

export const createLinkSuccessResponse = {
  id: 57,
  title: 'GAA Fixtures',
  original_link: 'https://www.gaa.ie/fixtures-results/',
  link_code: 'gaa',
  views: 0,
  created_at: '2023-10-05T13:27:57.687Z',
  updated_at: '2023-10-05T13:27:57.687Z'
}

export const createLinkErrorResponse = {
  error: 'Invalid values in the following fields: Original Link.'
}

export const updateLinkRequest = {
  title: 'GAA Fixtures & Results',
  link_code: 'gaares'
}

export const updateLinkSuccessResponse = {
  id: 57,
  title: 'GAA Fixtures & Results',
  original_link: 'https://www.gaa.ie/fixtures-results/',
  link_code: 'gaares',
  views: 0,
  created_at: '2023-10-05T13:27:57.691Z',
  updated_at: '2023-10-05T13:27:57.691Z'
}

export const updateLinkErrorResponse = {
  error: 'Invalid values in the following fields: Original Link.'
}

export const deleteLinkSuccessResponse = {
  status: true
}

export const deleteLinkErrorResponse = {
  error: 'Invalid values in the following fields: Original Link.'
}