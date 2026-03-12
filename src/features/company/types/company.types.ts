//  Profile 

export interface CompanyProfileResponse {
  userId:      number
  email:       string
  companyName: string | null
  industry:    string | null
  about:       string | null
  website:     string | null
  logoUrl:     string | null
  location:    string | null
}

export interface UpdateCompanyProfileRequest {
  companyName?: string | null
  industry?:    string | null
  about?:       string | null
  website?:     string | null
  location?:    string | null
}

export interface LogoResponse {
  logoUrl: string
}
