type Mapper<T> = (response: unknown) => T;

export interface UseDataServiceOptions<T> {
	endpoint: string;
	mapper?: Mapper<T>;
	immediate?: boolean;
}
