/*
    heap objects are {x,y,cost}
*/
export default class minHeap{
    constructor(){
        this.heap = [];
    }
    push(node){
        this.heap.push(node);
        let currentIndex = this.heap.length - 1;
        let parentIndex = Math.floor((currentIndex - 1)/2);
        while(currentIndex > 0 && this.heap[currentIndex][2] < this.heap[parentIndex][2]){
            [this.heap[currentIndex],this.heap[parentIndex]] = [this.heap[parentIndex],this.heap[currentIndex]];
            currentIndex = parentIndex;
            parentIndex = Math.floor((currentIndex - 1)/2);
        }
    }
    pop(){
        if(this.heap.length == 0)
            return undefined;
        let currentIndex = this.heap.length - 1;
        [this.heap[0],this.heap[currentIndex]] = [this.heap[currentIndex],this.heap[0]];
        const poppedNode = this.heap.pop();
        currentIndex = 0;
        let leftChildIndex = 2 * currentIndex + 1;
        let rightChildIndex = 2 * currentIndex + 2;
        while(leftChildIndex < this.heap.length && rightChildIndex < this.heap.length && (this.heap[leftChildIndex][2] < this.heap[currentIndex][2] || this.heap[rightChildIndex][2] < this.heap[currentIndex][2])){
            let smallerChildIndex = this.heap[leftChildIndex][2] < this.heap[rightChildIndex][2] ? leftChildIndex : rightChildIndex;
            [this.heap[currentIndex],this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex],this.heap[currentIndex]];
            currentIndex = smallerChildIndex;
            leftChildIndex = 2 * currentIndex + 1;
            rightChildIndex = 2 * currentIndex + 2;
        }
        return poppedNode;
    }
    isEmpty(){
        return this.heap.length == 0;
    }
}