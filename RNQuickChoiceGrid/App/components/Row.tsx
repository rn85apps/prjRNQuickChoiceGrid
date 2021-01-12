import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import Choice from "./Choice";

interface IAppProps {
	pcfContext: ComponentFramework.Context<IInputs>;
	recordId: string;
	options: ComponentFramework.PropertyHelper.OptionMetadata[];
	columns: DataSetInterfaces.Column[];
    target: string;
    onSave: ()=> void;
}



const App: React.FunctionComponent<IAppProps> = ({
	pcfContext,
	recordId,
	options,
	columns,
    target,
    onSave
}: IAppProps) => {
	const [value, setValue] = React.useState(
		pcfContext.parameters.dataset.records[recordId].getFormattedValue(
			columns[1].name
		)
	);

	const onChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {

            onSave();

			const index = options
				.map((option) => option.Label)
				.indexOf(event.target.value);
			const option = options[index];

            setValue(option.Label);
            
			executeSaveRecord();

			async function executeSaveRecord() {
				try {
					const optVal = option.Value;

					const data = {
						[columns[1].name]: optVal,
					};

					const response = await pcfContext.webAPI.updateRecord(
						target,
						recordId,
						data
					);

					if (!response) {
						throw new Error("updateRecord not successful");
                    }
                    
                    onSave();
				} catch (error) {
					console.log(error.message);
				}
			}
		},
		[pcfContext.webAPI, target, recordId, columns, options, onSave]
	);

	return (
		<>
			<tr>
				<td>
					<span
						title={pcfContext.parameters.dataset.records[
							recordId
						].getFormattedValue(columns[0].name)}
					>
						{pcfContext.parameters.dataset.records[
							recordId
						].getFormattedValue(columns[0].name)}
					</span>
				</td>
				{options.map((opt) => (
					<td key={opt.Value}>
						<Choice
							recordId={recordId}
							option={opt}
							onChange={onChange}
							checked={opt.Label === value}
						/>
					</td>
				))}
			</tr>
		</>
	);
};

export default App;
