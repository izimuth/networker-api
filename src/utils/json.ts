
export class JsonSerializable
{
	getJsonData()
	{
		return this;
	}

	toJson()
	{
		return JSON.stringify(this.getJsonData());
	}
}

export function shallowCopy<T extends object>(obj: T, fields: [keyof T]): Partial<T>
{
	const copy: Partial<T> = {};

	for(const key of fields)
	{
		copy[key] = obj[key];
	}

	return copy;
}

export function getJson<T extends object>(obj: T): string
{
	if (obj instanceof JsonSerializable)
	{
		return obj.toJson();
	}
	else
	{
		return JSON.stringify(obj);
	}
}