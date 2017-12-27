"use strict";

angular.module("exam.directives", []).directive("contact", function($compile) {
  return {
    template: "<div>{{contactItem.name}}</div>",
    scope: {
      contactItem: "=item",
      index: "@"
    },

    link: function(scope, element, attr) {
      var expanded = false;
      var childScope = null; //scope created for child element when expanded

      //if this is a group element, bind a 'click' event handler
      //so we can open and close the group
      if (scope.contactItem.type == "Group") {
        // element.append($compile("<div> Hi </div>")(scope));
        element.bind("click", function(event) {
          event.stopPropagation();
          //Toggle child element
          if (!expanded) {
            // create new inherited scope item is to be expanded
            childScope = scope.$new();
            expanded = true;

            //create child element for displaying the inner contacts
            //This is where the magical recursion happens :-)
            element
              .children()
              .append(
                $compile(
                  '<div style="position:relative;left:30px"><Contact ng-repeat="contact in contactItem.contacts" item="contact" index="{{$index}}" ></Contact></div>'
                )(childScope)
              );
          } else {
            //remove child element when item is colappsed
            if (childScope !== null) {
              // destroy scope of modal every time close modal
              childScope.$destroy();

              expanded = false;

              //remove the last child node
              var lastNodeIndex = element.children()[0].childNodes.length - 1;
              element.children()[0].childNodes[lastNodeIndex].remove();
            }
          }
          scope.$apply();
        });
      }
    }
  };
});
