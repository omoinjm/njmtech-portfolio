import { UseDataServiceOptions } from '@/interfaces/data_service_options';
import DataService from '@/services/data.service';
import { useEffect, useState } from 'react';

export const useDataService = <T>({
	endpoint,
	mapper,
	immediate = true,
}: UseDataServiceOptions<T>) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(immediate);
	const [error, setError] = useState<unknown>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await DataService.get_call(endpoint, null);
			setData(mapper ? mapper(response) : response);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (immediate) {
			fetchData();
		}
	}, [endpoint]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};
