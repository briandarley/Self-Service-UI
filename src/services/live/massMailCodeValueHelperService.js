import injector from "vue-inject";

function MassMailCodeValueHelperService() {
  return {
    //Given audience code value display order codes, order the tree and set child/parent relationships
    getCodeValueChildParentRelations(codes) {
      //this.codeValues = await MassMailService.getAudienceCodeValueDisplayOrder();

      let reduced = codes.reduce((val, curVal) => {
        let items = val.concat([curVal]);
        if (curVal.entities.length) {
          curVal.entities.forEach((item) => {
            item.parent = curVal;
          });
          return items.concat(curVal.entities);
        }

        return items;
      }, []);

      return reduced;
    },
    //Where codes is a string array of code values, where parentSelectedCodes == getCodeValueChildParentRelations() result
    getCodeValueChildParentRelationsMatched(codes,parentSelectedCodes){
        let selectedCodes = parentSelectedCodes.filter((item) =>
        codes.includes(
          item.code
        )
      );
      return selectedCodes;
    },
    //Where codes is a string array of code values
    //returns parent code values with nested children
    //orderedCodeList - represents the order list of available population codes, nested => massMailService.getAudienceCodeValueDisplayOrder()
    getParentCodeValues(codes,orderedCodeList){
        orderedCodeList = JSON.stringify(JSON.stringify(orderedCodeList));
        
     

        let reduced = this.getCodeValueChildParentRelations(orderedCodeList);
        let parentCodes = this.getCodeValueChildParentRelationsMatched(codes,reduced);
        let selectedParents = parentCodes.filter((v,i,a)=> a.indexOf(v) === i)


        selectedParents.forEach((parent) => {
            parent.children = selectedParents.filter(c => {
              if(!c.parent) return false;
              return c.scope === parent.code
            }
            );
          });


        return parentSelectedCodes;
    }
  };
}

injector.service(
  "MassMailCodeValueHelperService",
  
  MassMailCodeValueHelperService
);
