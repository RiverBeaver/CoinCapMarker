import { Injectable } from "@angular/core";

@Injectable()
export class VisualChartsService {
    public getChartOptions(name: string, chartPoints: number[][], unit: [string, number[]]) {
        return  {
            title: {
              text: 'Price change chart'
            },
            // plotOptions: {
            //   pie: {
            //     allowPointSelect: true,
            //     cursor: 'pointer',
            //     dataLabels: {
            //       enabled: true,
            //       format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            //     }
            //   }
            // },
            tooltip: {
              // shared: true,
              useHTML: true,
              headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
              pointFormat: '<tr><td style="color: {series.color}; font-weight: 900; text-shadow: {series.color} 0px 1px 1px;">{series.name}: ' +
                  '</td>' +
                  '<td style="text-align: right; font-weight: 900"><b>${point.y}</b></td></tr>',
              footerFormat: '</table>',
          },
            chart: {
              zooming: {
                  type: 'x'
              },
            },
            xAxis: {
                type: 'datetime',
                minRange: 1000 * 60 * 60, 
                units: [unit]
            },
            yAxis: {
              title:{
                text: 'Price, USD'
              }
            },
            series: [{
              name: name,
              type: 'line',
              data: chartPoints
            }]
          }
    }
}