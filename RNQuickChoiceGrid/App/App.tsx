import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import Row from "./components/Row";
import { useOptions } from "./hooks/useOptions";
import { DefaultButton } from "@fluentui/react/lib/Button";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IProps {
	columns: DataSetInterfaces.Column[];
	pcfContext: ComponentFramework.Context<IInputs>;
	target: string;
}

const App: React.FunctionComponent<IProps> = ({
	pcfContext,
	columns,
	target,
}: IProps) => {
	const recordIds = pcfContext.parameters.dataset.sortedRecordIds;

	/** custom hook for option set metadata */
	const options = useOptions({
		pcfContext,
		columnName: columns[1].name,
		target,
		utils: pcfContext.utils,
	});

	const [isSaving, setIsSaving] = React.useState(false);

	const onSave = React.useCallback(() => {
		setIsSaving((isSaving) => !isSaving);
	}, []);

	if (pcfContext.parameters.dataset.loading) {
		return <>Loading ....</>;
	}

	if (!options.length) {
		return <>Loading...</>;
	}

	return (
		<>
			<div className="rn-grid">
				<table>
					<thead>
						<tr>
							<th>{columns[0].displayName}</th>
							{options.map((opt) => (
								<th key={opt.Value} title={opt.Label}>
									{opt.Label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{recordIds.map((recordId) => (
							<Row
								pcfContext={pcfContext}
								recordId={recordId}
								options={options}
								columns={columns}
								key={recordId}
								target={target}
								onSave={onSave}
							></Row>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<div>
					{isSaving ? <>Saving ...</> : `${recordIds.length} of ${pcfContext.parameters.dataset.paging.totalResultCount} loaded`}
				</div>
				{pcfContext.parameters.dataset.paging.hasNextPage && (
					<DefaultButton
						text="Load more"
						onClick={() =>
							pcfContext.parameters.dataset.paging.loadNextPage()
						}
					/>
				)}
			</div>
		</>
	);
};

export default App;
