
export interface MessageOptions {
  to: string,
  from: string,
  subject:string,
  html: string
}

export interface MailConfigurations {
  service: string,
  host: string,
  port: number,
  requireTLS: boolean,
  auth: {
    user: string,
    pass: string
  }
}