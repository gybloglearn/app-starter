define([], function () {
    'use strict';
    function shift() {
        return function (sh, date) {
            var last3shiftdate=new Date("2017-08-31").getTime();
            var downdate=new Date(date).getTime();
            if(downdate<=last3shiftdate){

            var shifts=[];
            shifts[1] = ['D', 'D', 'C', 'C', 'C', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'D', 'D', 'D', 'D'];
            shifts[2] = ['A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'C', 'C', 'C', 'C', 'C', 'C'];
            shifts[3] = ['B', 'B', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'C', 'C', 'C', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B'];
            var stdate = new Date("2015-11-20").getTime();
            var targetdate=new Date(date).getTime();
            var number_day=Math.round((targetdate-stdate)/(24*3600*1000),0)%24;

            return shifts[sh][number_day];
            }

            else{
                var shifts=[];
                shifts[1]=['B','B','B','D','D','B','B','D','D','D','C','C','A','A','C','C','C','A','A','B','B','D','D','D','B','B','D','D','C','C','C','A','A','C','C','A','A','A','B','B','D','D','B','B','B','D','D','C','C','A','A','A','C','C','A','A'];
                shifts[2]=[];
                shifts[3]=['C','C','C','A','A','C','C','A','A','A','B','B','D','D','B','B','B','D','D','C','C','A','A','A','C','C','A','A','B','B','B','D','D','B','B','D','D','D','C','C','A','A','C','C','C','A','A','B','B','D','D','D','B','B','D','D'];
                var stdate = new Date("2017-09-01").getTime();
                var targetdate=new Date(date).getTime();
                var number_day=Math.round((targetdate-stdate)/(24*3600*1000),0)%56;

                return shifts[sh][number_day];
            }
        }
    } return shift;
});