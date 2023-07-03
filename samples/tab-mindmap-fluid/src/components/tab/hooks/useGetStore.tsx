import React from "react";
import { useFluidModelContext } from "./useFluidModelContext";
import { Draft } from "immer";
import { useImmerReducer, ImmerReducer } from "use-immer";
import { EventPayload, MindMapFluidModel } from "../model/MindMapFluidModel";

interface UseGetStoreProps<
	S,
	A extends { [id: string]: (payload: any) => void },
	Q extends { [id: string]: (...args: any) => any },
> {
	initialState: (model: MindMapFluidModel) => S;
	actions: {
		[Property in keyof A]: (model: MindMapFluidModel, payload: Parameters<A[Property]>[0]) => void;
	};
	queries: {
		[Property in keyof Q]: (
			state: S,
			...params: Parameters<Q[Property]>
		) => ReturnType<ReturnType<Q[Property]>>;
	};
	reducer: (model: MindMapFluidModel, draft: Draft<S>, payload: EventPayload) => void;
}

interface UseGetStoreReturn<A, Q> {
	dispatch: (payload: any) => void;
	actions: A;
	queries: Q;
}

export function useGetStore<
	S,
	A extends { [id: string]: (payload: any) => void },
	Q extends { [id: string]: (...args: any) => any },
>(props: UseGetStoreProps<S, A, Q>): UseGetStoreReturn<A, Q> {
	const model = useFluidModelContext();
	console.log("useGetStore UseGetStoreReturn");
	const reducer: ImmerReducer<S, any> = (draft, op) => props.reducer(model, draft, op);

	const [state, dispatchState] = useImmerReducer(reducer, props.initialState(model));

	React.useEffect(() => {
		const callItemDispatch = (payload: any) => {
			console.log("useGetStore callItemDispatch");
			dispatchState(payload);
		};

		model.on("modelChanged", callItemDispatch);
		return () => {
			model.off("modelChanged", callItemDispatch);
		};
	});

	const dispatch = (payload: any) => {
		const userAction = props.actions[payload.type];

		if (userAction !== undefined) {
			userAction(model, payload);
		}
	};

	const actions = {} as any;

	for (const i in props.actions) {
		actions[i] = (payload: any) => ({
			type: i,
			...payload,
		});
	}

	const queries = {} as any;

	for (const j in props.queries) {
		queries[j] = (...payload: any) => props.queries[j](state, ...payload);
	}

	return { dispatch, actions, queries };
}