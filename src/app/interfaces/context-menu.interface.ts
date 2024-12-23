
export interface ContextMenu {
    x: number;
    y: number;
    isShow: boolean;
    value?: number | undefined;
    parentIndex?: number | undefined;
    rootIndex?: number | undefined;
    childIndex?: number | undefined;
    isParent: boolean;
}