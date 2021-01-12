import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";

interface IUseOptions {
	pcfContext: ComponentFramework.Context<IInputs>;
	columnName: string;
	target: string;
	utils: ComponentFramework.Utility;
}

export const useOptions = ({
	pcfContext,
	columnName,
	target,
	utils,
}: IUseOptions): ComponentFramework.PropertyHelper.OptionMetadata[] => {
	const [options, setOptions] = React.useState<
		Array<ComponentFramework.PropertyHelper.OptionMetadata>
	>([]);

	/**
	 * Side effect that manages the state of the optionset metadata consumed by the component
	 */
	React.useEffect(() => {
		let cancel = false;

		// let demoOptions: ComponentFramework.PropertyHelper.OptionMetadata[] = [
		// 	{
		// 		Label: "One",
		// 		Value: 1000000,
		// 		Color: "red",
		// 	},
		// 	{
		// 		Label: "Two",
		// 		Value: 1000002,
		// 		Color: "blue",
		// 	},
		// 	{
		// 		Label: "Three",
		// 		Value: 1000003,
		// 		Color: "green",
		// 	},
		// ];

		// setOptions(demoOptions);

		async function executeRetrieveMetadata() {
			try {
				const response = await utils.getEntityMetadata(target, [
					columnName,
				]);
				const data: ComponentFramework.PropertyHelper.OptionMetadata[] = response.Attributes.get(
					columnName
				)?.attributeDescriptor.OptionSet;

				if (!cancel) {
					setOptions(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		}

		executeRetrieveMetadata();

		return () => {
			// Side effect cleanup function will run when
			// 1. The component unmounts
			// 2. The dependent property for the effect changes
			cancel = true;
		};
	}, [pcfContext, columnName, target, utils]);

	return options;
};
