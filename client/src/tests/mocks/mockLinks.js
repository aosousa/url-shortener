export const getLinksResponse = [
  {
    id: 1,
    title: "IDASO",
    original_link: "https://www.idaso.ie/",
    link_code: "idaso",
    views: 1,
    created_at: "2023-10-05T09:42:02.000Z",
    updated_at: "2023-10-05T11:35:11.000Z"
  }
]

export const createLinkRequest = {
  title: "GAA Fixtures",
  original_link: "https://www.gaa.ie/fixtures-results/",
  link_code: "gaa"
}

export const createLinkSuccessResponse = {
  id: 2,
  title: "GAA Fixtures",
  original_link: "https://www.gaa.ie/fixtures-results/",
  link_code: "gaa",
  views: 0,
  created_at: "2023-10-05T13:27:57.687Z",
  updated_at: "2023-10-05T13:27:57.687Z"
}

export const createLinkErrorResponse = {
  error: "Invalid values in the following fields: Original Link."
}

export const updateLinkRequest = {
  title: "GAA Fixtures & Results",
  link_code: "gaares"
}

export const updateLinkSuccessResponse = {
  id: 2,
  title: "GAA Fixtures & Results",
  original_link: "https://www.gaa.ie/fixtures-results/",
  link_code: "gaares",
  views: 0,
  created_at: "2023-10-05T13:27:57.691Z",
  updated_at: "2023-10-05T13:27:57.691Z"
}

export const updateLinkErrorResponse = {
  error: "Invalid values in the following fields: Original Link."
}

export const deleteLinkSuccessResponse = {
  status: true
}

export const deleteLinkErrorResponse = {
  error: "Invalid values in the following fields: Original Link."
}