/*
* name;
*/
class RandomUtils {

    public static limit(from: number, end: number): number {
        from = Math.min(from, end);
        end = Math.max(from, end);
        var range: number = end - from;
        return from + Math.random() * range;
    }

    public static limitInteger(from: number, end: number): number {
        return Math.round(this.limit(from, end));
    }

    public static randomArray(arr: Array<any>): any {
        var index: number = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}
