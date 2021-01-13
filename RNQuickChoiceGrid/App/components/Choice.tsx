import * as React from "react";

interface IChoiceProps {
	recordId: string;
	option: ComponentFramework.PropertyHelper.OptionMetadata;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const radioStyle: React.CSSProperties = {
	width: "1rem",
	cursor: "pointer",
	padding: 0,
	margin: 0,
	textAlign: "left",
};

const Choice: React.FunctionComponent<IChoiceProps> = ({
	recordId,
	option,
	checked,
	onChange,
}: IChoiceProps) => {
	return (
		<input
			style={radioStyle}
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
