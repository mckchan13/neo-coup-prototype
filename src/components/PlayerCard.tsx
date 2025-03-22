import { useContext } from "react";
import { GlobalContext } from "../context";
import { sendEvent, type UUID } from "../statemachine";
import PlayerActionButton from "./PlayerActionButton";
import { type CoupCharacterActionNames, characterCardNames } from "../types";

export type CoupPlayerEvent<
	T =
		| "Coup"
		| "Character Action"
		| "Income"
		| "Foreign Aid"
		| "Challenge"
		| "Not Challenge",
> = {
	type: T;
	name?: T extends "Character Action" ? CoupCharacterActionNames : undefined;
	target?: number;
};

export default function PlayerCard(props: {
	name: string;
	coins: number;
	disabled: boolean;
	playerId: number;
}): JSX.Element {
	const { globalContext, setGlobalContext } = useContext(GlobalContext);
	const { name, coins, playerId } = props;

	const disabled = globalContext.currentPlayer !== playerId;

	function createSendEventClickHandler(event: CoupPlayerEvent) {
		return () => {
			const response = sendEvent(event, globalContext.sessionId as UUID);
			console.log(`${event.type} response`, response);
			const [error, updatedGameState] = response;

			if (error !== null || updatedGameState === null) {
				console.error(error.message);
				throw new Error(`${event.type} failed`);
			}

			sessionStorage.setItem("coupGameState", JSON.stringify(updatedGameState));

			setGlobalContext((prevState) => ({
				...prevState,
				...updatedGameState.context,
			}));
		};
	}

	const handleClickCoup = createSendEventClickHandler({ type: "Coup" });

	const CharacterActionButtons = characterCardNames.map((name) => {
		const handleClickCharacterEvent = createSendEventClickHandler({
			type: "Character Action",
			name,
		} satisfies CoupPlayerEvent<"Character Action">);

		return (
			<PlayerActionButton
				disabled={disabled}
				onClick={handleClickCharacterEvent}
				title={name}
				key={name}
			/>
		);
	});

	return (
		<div
			style={{
				display: "inline-block",
				marginRight: "1rem",
				marginLeft: "1rem",
				width: "125px",
				height: "max-content",
				border: "solid 1px black",
				padding: "0.5rem",
			}}
		>
			<p
				style={{
					marginLeft: "auto",
					marginRight: "auto",
					width: "fit-content",
				}}
			>
				Name: {name}
			</p>
			<p
				style={{
					marginLeft: "auto",
					marginRight: "auto",
					width: "fit-content",
				}}
			>
				Coins: {coins}
			</p>
			<div className="action-section">
				<h3
					style={{
						marginLeft: "auto",
						marginRight: "auto",
						width: "fit-content",
					}}
				>
					Actions
				</h3>
				<div style={{ width: "fit-content" }} className="action-buttons">
					<PlayerActionButton
						onClick={handleClickCoup}
						disabled={disabled}
						style={{}}
						title="Coup"
						key={"Coup"}
					/>
					<PlayerActionButton
						onClick={createSendEventClickHandler({ type: "Income" })}
						disabled={disabled}
						style={{}}
						title="Income"
						key={"Income"}
					/>
					<PlayerActionButton
						onClick={createSendEventClickHandler({ type: "Foreign Aid" })}
						disabled={disabled}
						style={{}}
						title="Foreign Aid"
						key={"Foreign Aid"}
					/>
					{CharacterActionButtons}
					<PlayerActionButton
						onClick={createSendEventClickHandler({ type: "Challenge" })}
						disabled={disabled}
						style={{}}
						title="Challenge"
						key={"Challenge"}
					/>
					<PlayerActionButton
						onClick={createSendEventClickHandler({ type: "Not Challenge" })}
						disabled={disabled}
						style={{}}
						title="Challenge"
						key={"Challenge"}
					/>
				</div>
			</div>
		</div>
	);
}
