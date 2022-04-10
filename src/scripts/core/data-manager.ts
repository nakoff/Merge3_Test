import { IDataObject, ObjectType } from './data-object';

export class DataManager {
    static _db: Map<ObjectType, Array<IDataObject>>;
    static _incId: integer = 0;

    public init(storage: Map<ObjectType, Array<IDataObject>>): void  {
        DataManager._incId = 0;
        storage.clear();
        DataManager._db = storage;
    }

    public addObject(dataObj: IDataObject): string | null {
        let error: string | null = null;

        let arr = DataManager._db.get(dataObj.type);
        if (!arr) {
            arr = new Array<IDataObject>();
            DataManager._db.set(dataObj.type, arr);
        }

        dataObj.id = DataManager._incId;
        DataManager._incId++;
        arr.push(dataObj);

        return error;
    }

    public getObjects(type: ObjectType): Array<IDataObject> {
        let objs = DataManager._db.get(type);
        if (!objs) {
            objs = new Array<IDataObject>();
            DataManager._db.set(type, objs);
        }
        return objs;
    }

    public getObject(type: ObjectType, id: integer): {obj:IDataObject | null, err:string} {
        let obj: IDataObject | null = null;
        let err: string = "";

        const objs = DataManager._db.get(type);
        if (objs) {
            for (const o of objs) {
                if (o.id === id) {
                    obj = o;
                    break;
                }
            }
        }

        if (!objs) 
            err = "There is no objects with type "+type;
        else if (!obj)
            err = `object type: ${type}, id: ${id} not found`;

        return {obj, err};
    }

    public dump(type: ObjectType): void{
        const objs = DataManager._db.get(type);
        console.log("===============");
        if (objs)
            console.log(objs[0]);
        console.log("===============");
    }
}