import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { Newsletter } from './newsletter';

export const MailchimpForm = () => {
	const postUrl: any = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

	return (
		<>
			<MailchimpSubscribe
				url={postUrl}
				render={({ subscribe, status, message }: any) => (
					<Newsletter
						status={status}
						message={message}
						onValidated={(formData: any) => subscribe(formData)}
					/>
				)}
			/>
		</>
	);
};
