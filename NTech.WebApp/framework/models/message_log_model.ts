export interface MessageLogModel {
    subject: string;
    body?: string;
    to_field: string;
    cc_field?: string;
    bcc_field?: string;
    from_name: string;
    html_template: string;
}
