import * as React from "react";

interface IChoiceProps {
	recordId: string;
	option: ComponentFramework.PropertyHelper.OptionMetadata;
    checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Choice: React.FunctionComponent<IChoiceProps> = ({
	recordId,
	option,
    checked,
	onChange,
}: IChoiceProps) => {

	return (
		<input
			className="rn-radio"
			type="radio"
			name={recordId}
			value={option.Label}
			onChange={onChange}
			checked={checked}
			title={option.Label}
		/>
	);
};

export default Choice;
