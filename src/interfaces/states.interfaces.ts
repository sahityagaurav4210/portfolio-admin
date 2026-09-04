export interface IProfilePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  websites: string;
  avatar?: string;
  _id?: string;
}

export interface IAuthUserPayload {
  name: string;
  email?: string;
  phone: string;
}

export interface IAuthUserProfilePayload {
  name: string;
  email?: string;
  phone: string;
  websites?: string[];
  address?: string;
}

export interface IHeroSectionPayload {
  displayName: string;
  about: string;
  activeGithubContributions: number;
  codingQuestionSolved: number;
  designation: string;
  experience: number;
  hackerrankUrl?: string;
  leetcodeUrl?: string;
  linkedInUrl?: string;
  projectsDelivered: number;
  specialization: Array<string>;
  twitterUrl?: string;
  tags?: Array<string>;
}
