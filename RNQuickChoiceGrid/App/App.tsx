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
	const [isSaving, setIsSaving] = React.useState(false);

	/** custom hook for option set metadata */
	const options = useOptions({
		pcfContext,
		columnName: columns[1].name,
		target,
		utils: pcfContext.utils,
	});

	const recordIds = pcfContext.parameters.dataset.sortedRecordIds;

	const onSave = React.useCallback(() => {
		setIsSaving((isSaving) => !isSaving);
	}, []);

	if (
		pcfContext.parameters.dataset.loading ||
		!options.length ||
		!columns.length
	) {
		return <>Loading ....</>;
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
			<div className="rn-footer">
				<div className="rn-footer-left">{`${recordIds.length} of ${pcfContext.parameters.dataset.paging.totalResultCount} loaded`}</div>
				<div className="rn-footer-center">
					{pcfContext.parameters.dataset.paging.hasNextPage && (
						<DefaultButton
							text="Load more"
							onClick={() =>
								pcfContext.parameters.dataset.paging.loadNextPage()
							}
						/>
					)}
				</div>
				<div className="rn-footer-right">{isSaving && "Saving..."}</div>
			</div>
		</>
	);
};

export default App;
