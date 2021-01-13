import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import Choice from "./Choice";
import { isContext } from "vm";

interface IAppProps {
	pcfContext: ComponentFramework.Context<IInputs>;
	recordId: string;
	options: ComponentFramework.PropertyHelper.OptionMetadata[];
	columns: DataSetInterfaces.Column[];
	target: string;
	isDisabled: boolean;
	onSave: () => void;
}

const App: React.FunctionComponent<IAppProps> = ({
	pcfContext,
	recordId,
	options,
	columns,
	target,
	isDisabled,
	onSave,
}: IAppProps) => {
	const [value, setValue] = React.useState(
		pcfContext.parameters.dataset.records[recordId].getFormattedValue(
			columns[1].name
		)
	);

	/** Callback handler used for updating the selected option value.
	 *  Uses the webAPI to update the data source.
	 */
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

	/** Event handler for clicking the display name */
	const onDisplayNameClick = () => {
		const entityReference = pcfContext.parameters.dataset.records[
			recordId
		].getNamedReference();
		pcfContext.parameters.dataset.openDatasetItem(entityReference);
	};

	const displayName = pcfContext.parameters.dataset.records[
		recordId
	].getFormattedValue(columns[0].name);

	return (
		<>
			<tr>
				<td>
					<span
						className="rn-display-name"
						title={displayName}
						onClick={onDisplayNameClick}
					>
						{displayName}
					</span>
				</td>
				{options.map((opt) => (
					<td key={opt.Value}>
						<Choice
							recordId={recordId}
							option={opt}
							onChange={onChange}
							checked={opt.Label === value}
							isDisabled={isDisabled}
						/>
					</td>
				))}
			</tr>
		</>
	);
};

export default App;
