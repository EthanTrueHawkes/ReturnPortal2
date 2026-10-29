import test from 'node:test'
import assert from 'node:assert/strict'
import {calculate} from '../src/calculation.ts'
import {newDraft} from '../src/model.ts'
import {items,locations,products} from '../src/data.ts'

test('adding another return starts with unused offer eligibility and empty photos/cart',()=>{
 const first={...newDraft(items[0]),offerSeen:'shop',front:true,back:true,replacement:{product:products[0],waist:27,inseam:30,color:0}}
 const second=newDraft(items[1])
 assert.equal(first.offerSeen,'shop');assert.equal(second.offerSeen,null)
 assert.equal(second.front,false);assert.equal(second.back,false);assert.equal(second.replacement,undefined)
})
test('full refund adds the demo tax',()=>assert.equal(calculate([newDraft(items[0])],locations[1]).total,83.02))
test('same-item size exchange is free without bonus or tax',()=>{
 const result=calculate([{...newDraft(items[0]),outcome:'size'}],locations[1])
 assert.equal(result.total,0);assert.equal(result.bonus,0);assert.equal(result.tax,0)
})
test('keep-item offer returns 20 percent without pickup fees or tax',()=>{
 const result=calculate([{...newDraft(items[0]),outcome:'keep'}],locations[0])
 assert.equal(result.total,15.9);assert.equal(result.fee,0);assert.equal(result.tax,0)
})
test('shopping exchange uses selected replacement price and 10 percent bonus',()=>{
 const draft={...newDraft(items[2]),outcome:'shop',replacement:{product:products[0],waist:27,inseam:30,color:0}}
 const result=calculate([draft],locations[1])
 assert.equal(result.bonus,12.6);assert.equal(result.newTotal,60);assert.equal(result.total,82.1)
})
test('pickup fee is deducted once across multiple returned items',()=>assert.equal(calculate([newDraft(items[0]),newDraft(items[1])],locations[0]).total,161.04))
test('pickup fee is waived when it exceeds the available refund',()=>{
 const draft={...newDraft(items[0]),outcome:'shop',replacement:{product:products[4],waist:27,inseam:30,color:0}}
 assert.equal(calculate([draft],locations[0]).total,.97)
 assert.equal(calculate([draft],locations[0]).fee,0)
 assert.equal(calculate([draft],locations[1]).total,.97)
})

test('same-item exchange permits paid pickup with the fee waived',()=>{
 const result=calculate([{...newDraft(items[0]),outcome:'size'}],locations[0])
 assert.equal(result.total,0);assert.equal(result.fee,0)
})
