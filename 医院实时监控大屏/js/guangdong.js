// 广东省地图数据 - 使用ECharts geo组件
var guangdongGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "广东省",
        "adcode": "440000"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [109.7, 20.2], [110.5, 20.1], [111.8, 20.3], [113.2, 20.5], 
          [114.8, 20.8], [115.9, 21.2], [116.8, 22.1], [117.2, 23.2], 
          [117.0, 24.1], [116.5, 24.8], [115.8, 25.3], [114.9, 25.5], 
          [113.8, 25.4], [112.7, 25.2], [111.6, 24.8], [110.8, 24.3], 
          [110.2, 23.6], [109.8, 22.8], [109.7, 21.9], [109.7, 20.2]
        ]]
      }
    }
  ]
};

// 广东省21个地级市数据
var guangdongCities = [
  // 珠三角地区
  {name: '广州市', value: [113.264434, 23.129162, 1500], region: '珠三角', color: '#ff4757'},
  {name: '深圳市', value: [114.085947, 22.547, 1300], region: '珠三角', color: '#ff4757'},
  {name: '珠海市', value: [113.553986, 22.224979, 180], region: '珠三角', color: '#ff4757'},
  {name: '佛山市', value: [113.122717, 23.028762, 750], region: '珠三角', color: '#ff4757'},
  {name: '东莞市', value: [113.746262, 23.046237, 830], region: '珠三角', color: '#ff4757'},
  {name: '中山市', value: [113.382391, 22.521113, 320], region: '珠三角', color: '#ff4757'},
  {name: '江门市', value: [113.094942, 22.590431, 460], region: '珠三角', color: '#ff4757'},
  {name: '肇庆市', value: [112.472529, 23.051546, 410], region: '珠三角', color: '#ff4757'},
  {name: '惠州市', value: [114.412599, 23.079404, 480], region: '珠三角', color: '#ff4757'},
  
  // 粤东地区
  {name: '汕头市', value: [116.708463, 23.37102, 560], region: '粤东', color: '#2ed573'},
  {name: '潮州市', value: [116.632301, 23.661701, 270], region: '粤东', color: '#2ed573'},
  {name: '揭阳市', value: [116.355733, 23.543778, 600], region: '粤东', color: '#2ed573'},
  {name: '汕尾市', value: [115.364238, 22.774485, 300], region: '粤东', color: '#2ed573'},
  
  // 粤西地区
  {name: '湛江市', value: [110.364977, 21.274898, 730], region: '粤西', color: '#ffa502'},
  {name: '茂名市', value: [110.919229, 21.659751, 620], region: '粤西', color: '#ffa502'},
  {name: '阳江市', value: [111.975107, 21.859222, 250], region: '粤西', color: '#ffa502'},
  {name: '云浮市', value: [112.044439, 22.929801, 250], region: '粤西', color: '#ffa502'},
  
  // 粤北地区
  {name: '韶关市', value: [113.591544, 24.801322, 300], region: '粤北', color: '#a55eea'},
  {name: '清远市', value: [113.051227, 23.685022, 380], region: '粤北', color: '#a55eea'},
  {name: '梅州市', value: [116.117582, 24.299112, 440], region: '粤北', color: '#a55eea'},
  {name: '河源市', value: [114.697802, 23.746266, 300], region: '粤北', color: '#a55eea'}
];

// 注册地图
echarts.registerMap('guangdong', guangdongGeoJSON);

// 地图配置选项
var guangdongMapOption = {
  backgroundColor: 'transparent',
  title: {
    text: '广东省地图',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      if (params.seriesType === 'effectScatter') {
        return params.name + '<br/>人口: ' + params.value[2] + '万人<br/>区域: ' + params.data.region;
      } else {
        return params.name;
      }
    },
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#fff',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    orient: 'vertical',
    left: 20,
    bottom: 20,
    data: ['珠三角', '粤东', '粤西', '粤北'],
    textStyle: {
      color: '#fff',
      fontSize: 12
    },
    itemWidth: 15,
    itemHeight: 10
  },
  geo: {
    map: 'guangdong',
    roam: true,
    zoom: 1.2,
    center: [113.5, 23.5],
    itemStyle: {
      areaColor: '#1e3a8a',
      borderColor: '#3b82f6',
      borderWidth: 2
    },
    emphasis: {
      itemStyle: {
        areaColor: '#2563eb'
      }
    },
    label: {
      show: true,
      color: '#fff',
      fontSize: 12
    }
  },
  series: [
    {
      name: '广东省',
      type: 'map',
      map: 'guangdong',
      geoIndex: 0,
      data: [{name: '广东省', value: 11521}]
    },
    {
      name: '珠三角',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: guangdongCities.filter(city => city.region === '珠三角'),
      symbolSize: function(val) {
        return Math.max(val[2] / 50, 8);
      },
      itemStyle: {
        color: '#ff4757'
      },
      rippleEffect: {
        brushType: 'stroke',
        scale: 2.5
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: '#fff',
        fontSize: 10
      }
    },
    {
      name: '粤东',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: guangdongCities.filter(city => city.region === '粤东'),
      symbolSize: function(val) {
        return Math.max(val[2] / 50, 8);
      },
      itemStyle: {
        color: '#2ed573'
      },
      rippleEffect: {
        brushType: 'stroke',
        scale: 2.5
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: '#fff',
        fontSize: 10
      }
    },
    {
      name: '粤西',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: guangdongCities.filter(city => city.region === '粤西'),
      symbolSize: function(val) {
        return Math.max(val[2] / 50, 8);
      },
      itemStyle: {
        color: '#ffa502'
      },
      rippleEffect: {
        brushType: 'stroke',
        scale: 2.5
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: '#fff',
        fontSize: 10
      }
    },
    {
      name: '粤北',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: guangdongCities.filter(city => city.region === '粤北'),
      symbolSize: function(val) {
        return Math.max(val[2] / 50, 8);
      },
      itemStyle: {
        color: '#a55eea'
      },
      rippleEffect: {
        brushType: 'stroke',
        scale: 2.5
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: '#fff',
        fontSize: 10
      }
    }
  ]
};