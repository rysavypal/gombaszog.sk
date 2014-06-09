require 'nokogiri'
module Jekyll
  module StripFilter
    def strip(input)
      input.gsub /\{%[^%]*%\}/, ''
      input = Nokogiri::HTML(input).text
    end
  end
end

Liquid::Template.register_filter(Jekyll::StripFilter)
